---
name: latimore-os-crm-ops
description: Diagnose and operate Latimore Life & Legacy CRM workflows: leads, contacts, deals, activities, follow-ups, backend provider mode, and Supabase schema.
---

# Latimore OS CRM Ops Loop

Use this skill for lead workflow, CRM pipeline, data sync, and follow-up operations.

## Workflow

1. Identify backend mode: local, Firebase, or Supabase.
2. Verify required entities:
   - contacts
   - deals
   - activities
   - contents
   - social_accounts
   - social_posts
3. Confirm each CRM record has owner identity:
   - browser model: `ownerUid`
   - Supabase model: `owner_uid`
4. Sort leads by urgency:
   - New
   - Qualified
   - Booked
   - Closed Won
   - No response
   - No-show
   - Dormant
5. Return exact next actions: call, text, email, booking link, or pipeline move.

## Business rules

- Keep tone practical, local, and mission-driven.
- Lead stages should support family protection, retirement, business owner, final expense, and recruiting workflows.
- Preserve Latimore Life & Legacy brand voice: clear, protective, legacy-focused, and not fear-based.
