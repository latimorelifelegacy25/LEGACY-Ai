import { supabase, isSupabaseConfigured } from '../supabase';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

const dataProvider = String((import.meta as any).env?.VITE_DATA_PROVIDER || '')
  .trim()
  .toLowerCase();

const wantsLocal = dataProvider === 'local';
const wantsFirebase = dataProvider === 'firebase';
const wantsSupabase = dataProvider === 'supabase';

// Important repair behavior:
// - local: always browser localStorage
// - supabase with keys: Supabase first, local fallback on runtime failure
// - supabase without keys: local fallback instead of accidentally trying Firestore
// - firebase: Firestore first, local fallback on permissions/config/runtime failure
// - blank provider: Supabase if configured, otherwise Firebase for backwards compatibility
const forceLocal = wantsLocal || (wantsSupabase && !isSupabaseConfigured);
const forceFirebase = wantsFirebase;
const useSupabase = isSupabaseConfigured && !forceLocal && !forceFirebase && (wantsSupabase || dataProvider === '');

const localEventName = 'nexus-crm-local-db-change';

const camelToSnake = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      acc[snakeKey] = camelToSnake(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

const snakeToCamel = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key) => {
      const camelKey = key.replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace('-', '').replace('_', '')
      );
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

const hasWindowStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const makeLocalKey = (collectionName: string, ownerUid: string) =>
  `nexus_crm:${ownerUid}:${collectionName}`;

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const sortRows = <T extends Record<string, any>>(
  rows: T[],
  orderField: string,
  orderDir: 'asc' | 'desc'
): T[] => {
  return [...rows].sort((a, b) => {
    const rawA = a?.[orderField];
    const rawB = b?.[orderField];
    const valA = typeof rawA === 'number' ? rawA : rawA ? new Date(rawA).getTime() : 0;
    const valB = typeof rawB === 'number' ? rawB : rawB ? new Date(rawB).getTime() : 0;
    return orderDir === 'desc' ? valB - valA : valA - valB;
  });
};

const readLocalRows = (collectionName: string, ownerUid: string): any[] => {
  if (!hasWindowStorage()) return [];
  try {
    const raw = window.localStorage.getItem(makeLocalKey(collectionName, ownerUid));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn(`Local CRM read failed for ${collectionName}:`, error);
    return [];
  }
};

const writeLocalRows = (collectionName: string, ownerUid: string, rows: any[]) => {
  if (!hasWindowStorage()) return;
  window.localStorage.setItem(makeLocalKey(collectionName, ownerUid), JSON.stringify(rows));
  window.dispatchEvent(
    new CustomEvent(localEventName, { detail: { collectionName, ownerUid } })
  );
};

const listLocalOwnerUidsForCollection = (collectionName: string): string[] => {
  if (!hasWindowStorage()) return [];
  const suffix = `:${collectionName}`;
  const owners = new Set<string>();

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index) || '';
    if (!key.startsWith('nexus_crm:') || !key.endsWith(suffix)) continue;
    const ownerUid = key.slice('nexus_crm:'.length, -suffix.length);
    if (ownerUid) owners.add(ownerUid);
  }

  return Array.from(owners);
};

const findLocalOwnerUidForRow = (collectionName: string, id: string, fallbackOwnerUid?: string): string => {
  if (fallbackOwnerUid) return fallbackOwnerUid;

  const owners = listLocalOwnerUidsForCollection(collectionName);
  const match = owners.find((ownerUid) => readLocalRows(collectionName, ownerUid).some((row) => row.id === id));
  return match || 'local-admin-latimore';
};

const subscribeLocal = <T>(
  collectionName: string,
  ownerUid: string,
  callback: (data: T[]) => void,
  orderField: string,
  orderDir: 'asc' | 'desc'
): (() => void) => {
  const publish = () => {
    callback(sortRows(readLocalRows(collectionName, ownerUid), orderField, orderDir) as T[]);
  };

  publish();

  if (typeof window === 'undefined') return () => {};

  const onLocalChange = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    if (!detail || (detail.collectionName === collectionName && detail.ownerUid === ownerUid)) {
      publish();
    }
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key === makeLocalKey(collectionName, ownerUid)) publish();
  };

  window.addEventListener(localEventName, onLocalChange as EventListener);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(localEventName, onLocalChange as EventListener);
    window.removeEventListener('storage', onStorage);
  };
};

const addLocal = async (collectionName: string, data: any): Promise<string> => {
  const ownerUid = data.ownerUid || data.owner_uid || 'local-admin-latimore';
  const rows = readLocalRows(collectionName, ownerUid);
  const id = data.id || createId();
  writeLocalRows(collectionName, ownerUid, [...rows, { ...data, id }]);
  return id;
};

const updateLocal = async (
  collectionName: string,
  id: string,
  data: any,
  fallbackOwnerUid?: string
): Promise<void> => {
  const ownerUid = data.ownerUid || data.owner_uid || findLocalOwnerUidForRow(collectionName, id, fallbackOwnerUid);
  const rows = readLocalRows(collectionName, ownerUid);
  const nextRows = rows.map((row) => (row.id === id ? { ...row, ...data, id } : row));
  writeLocalRows(collectionName, ownerUid, nextRows);
};

const deleteLocal = async (collectionName: string, id: string, ownerUid?: string) => {
  const resolvedOwnerUid = findLocalOwnerUidForRow(collectionName, id, ownerUid);
  const rows = readLocalRows(collectionName, resolvedOwnerUid);
  writeLocalRows(
    collectionName,
    resolvedOwnerUid,
    rows.filter((row) => row.id !== id)
  );
};

export const dbService = {
  isSupabaseActive(): boolean {
    return useSupabase;
  },

  getProvider(): 'supabase' | 'firebase' | 'local' {
    if (useSupabase) return 'supabase';
    if (forceLocal) return 'local';
    return 'firebase';
  },

  subscribe<T>(
    collectionName: string,
    ownerUid: string,
    callback: (data: T[]) => void,
    orderField: string = 'createdAt',
    orderDir: 'asc' | 'desc' = 'desc'
  ): () => void {
    if (useSupabase && supabase) {
      let localUnsubscribe: (() => void) | null = null;

      const activateLocalFallback = (reason: string, error?: unknown) => {
        console.warn(`Supabase ${reason} failed for ${collectionName}. Using local fallback:`, error);
        if (!localUnsubscribe) {
          localUnsubscribe = subscribeLocal<T>(collectionName, ownerUid, callback, orderField, orderDir);
        }
      };

      const fetchData = async () => {
        try {
          const { data, error } = await supabase
            .from(collectionName)
            .select('*')
            .eq('owner_uid', ownerUid)
            .order(camelToSnake(orderField), { ascending: orderDir === 'asc' });

          if (error) {
            activateLocalFallback('fetch', error);
          } else {
            callback(snakeToCamel(data || []) as T[]);
          }
        } catch (error) {
          activateLocalFallback('connection', error);
        }
      };

      fetchData();

      const subscription = supabase
        .channel(`public:${collectionName}:${ownerUid}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: collectionName, filter: `owner_uid=eq.${ownerUid}` },
          fetchData
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            activateLocalFallback(`realtime ${status.toLowerCase()}`);
          }
        });

      return () => {
        subscription.unsubscribe();
        localUnsubscribe?.();
      };
    }

    if (forceLocal) {
      return subscribeLocal<T>(collectionName, ownerUid, callback, orderField, orderDir);
    }

    try {
      const firestoreQuery = query(
        collection(db, collectionName),
        where('ownerUid', '==', ownerUid),
        orderBy(orderField, orderDir)
      );

      let localUnsubscribe: (() => void) | null = null;
      const unsubscribe = onSnapshot(
        firestoreQuery,
        (snapshot) => {
          const data = snapshot.docs.map((snapshotDoc) => ({
            id: snapshotDoc.id,
            ...snapshotDoc.data(),
          })) as any[];
          callback(sortRows(data, orderField, orderDir) as T[]);
        },
        (error) => {
          console.warn(`Firestore subscription failed for ${collectionName}. Using local fallback:`, error);
          localUnsubscribe = subscribeLocal<T>(collectionName, ownerUid, callback, orderField, orderDir);
        }
      );

      return () => {
        unsubscribe();
        localUnsubscribe?.();
      };
    } catch (error) {
      console.warn(`Firestore query could not start for ${collectionName}. Using local fallback:`, error);
      return subscribeLocal<T>(collectionName, ownerUid, callback, orderField, orderDir);
    }
  },

  async add(collectionName: string, data: any): Promise<string> {
    if (useSupabase && supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from(collectionName)
          .insert([camelToSnake(data)])
          .select('id')
          .single();

        if (error) throw error;
        return inserted?.id || '';
      } catch (error) {
        console.warn(`Supabase add failed for ${collectionName}. Saved locally instead:`, error);
        return addLocal(collectionName, data);
      }
    }

    if (forceLocal) return addLocal(collectionName, data);

    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (error) {
      console.warn(`Firestore add failed for ${collectionName}. Saved locally instead:`, error);
      return addLocal(collectionName, data);
    }
  },

  async update(collectionName: string, id: string, data: any, ownerUid?: string): Promise<void> {
    if (useSupabase && supabase) {
      try {
        let updateQuery = supabase
          .from(collectionName)
          .update(camelToSnake(data))
          .eq('id', id);

        if (ownerUid) {
          updateQuery = updateQuery.eq('owner_uid', ownerUid);
        }

        const { error } = await updateQuery;

        if (error) throw error;
        return;
      } catch (error) {
        console.warn(`Supabase update failed for ${collectionName}. Updated local fallback:`, error);
        return updateLocal(collectionName, id, data, ownerUid);
      }
    }

    if (forceLocal) return updateLocal(collectionName, id, data, ownerUid);

    try {
      await updateDoc(doc(db, collectionName, id), data);
    } catch (error) {
      console.warn(`Firestore update failed for ${collectionName}. Updated local fallback:`, error);
      await updateLocal(collectionName, id, data, ownerUid);
    }
  },

  async delete(collectionName: string, id: string, ownerUid?: string): Promise<void> {
    if (useSupabase && supabase) {
      try {
        let deleteQuery = supabase.from(collectionName).delete().eq('id', id);

        if (ownerUid) {
          deleteQuery = deleteQuery.eq('owner_uid', ownerUid);
        }

        const { error } = await deleteQuery;
        if (error) throw error;
        return;
      } catch (error) {
        console.warn(`Supabase delete failed for ${collectionName}. Deleted from local fallback:`, error);
        return deleteLocal(collectionName, id, ownerUid);
      }
    }

    if (forceLocal) return deleteLocal(collectionName, id, ownerUid);

    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.warn(`Firestore delete failed for ${collectionName}. Deleted from local fallback:`, error);
      await deleteLocal(collectionName, id, ownerUid);
    }
  },

  async getAll(collectionName: string, ownerUid: string): Promise<any[]> {
    if (useSupabase && supabase) {
      try {
        const { data, error } = await supabase
          .from(collectionName)
          .select('*')
          .eq('owner_uid', ownerUid);

        if (error) throw error;
        return snakeToCamel(data || []);
      } catch (error) {
        console.warn(`Supabase getAll failed for ${collectionName}. Reading local fallback:`, error);
        return readLocalRows(collectionName, ownerUid);
      }
    }

    if (forceLocal) return readLocalRows(collectionName, ownerUid);

    try {
      const firestoreQuery = query(collection(db, collectionName), where('ownerUid', '==', ownerUid));
      const snapshot = await getDocs(firestoreQuery);
      return snapshot.docs.map((snapshotDoc) => ({
        id: snapshotDoc.id,
        ...snapshotDoc.data(),
      }));
    } catch (error) {
      console.warn(`Firestore getAll failed for ${collectionName}. Reading local fallback:`, error);
      return readLocalRows(collectionName, ownerUid);
    }
  },
};
