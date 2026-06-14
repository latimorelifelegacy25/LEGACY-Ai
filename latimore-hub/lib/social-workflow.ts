export interface SocialWorkflowConfig {
  brandName: string
  serviceRegions: string
  brandToneSummary: string
  coreMessage: string
  brandTagline: string
  primaryPlatforms: string
  complianceFooter: string
  targetAudienceSegment: string
  weekStartDate: string
  localMarketsFocus: string
  visualPrimaryColorHex: string
  visualAccentColorHex: string
  visualLogoDescription: string
  visualStyleRules: string
  databaseFields: string
  ctaDestinationLabel: string
  ctaDestinationUrl: string
}

export const defaultSocialConfig: SocialWorkflowConfig = {
  brandName: "Latimore Life & Legacy LLC",
  serviceRegions: "Schuylkill, Luzerne, and Northumberland Counties in Pennsylvania",
  brandToneSummary: "Authoritative, calm, community-focused, preparation over fear",
  coreMessage: "Protecting Today. Securing Tomorrow.",
  brandTagline: "#TheBeatGoesOn",
  primaryPlatforms: "Facebook, LinkedIn",
  complianceFooter: "Jackson M. Latimore Sr., Independent Insurance Consultant, PA License #1268820 | NIPR #21638507. Educational content only.",
  targetAudienceSegment: "Young families in Schuylkill County",
  weekStartDate: "2026-02-17",
  localMarketsFocus: "Schuylkill County and surrounding Coal Region communities",
  visualPrimaryColorHex: "#2C3E50",
  visualAccentColorHex: "#C49A6C",
  visualLogoDescription: "Shield and house roof mark with heartbeat line turning into upward arrow",
  visualStyleRules: "Navy and gold, no gradients, clean typography, real local imagery",
  databaseFields: "Audience; Pillar; Post Type; Status; Scheduled Date; CTA Type; Performance Notes",
  ctaDestinationLabel: "Online calendar booking page",
  ctaDestinationUrl: "https://latimorehub.vercel.app/book"
}

export interface SocialPost {
  day: string
  platform: string
  audienceSegment: string
  postCopy: string
  pillar: string
  ctaType: string
}

export interface VideoScript {
  hook: string
  explanation: string
  cta: string
  alternativeHooks: string[]
}

export interface CanvaDesignBrief {
  designOverview: string
  slides: Array<{
    slideNumber: number
    headline: string
    supportingText: string
    visualNotes: string
  }>
  ctaSlide: {
    ctaText: string
    linkReference: string
  }
  canvaNotes: string
}

export class SocialContentGenerator {
  private config: SocialWorkflowConfig

  constructor(config: SocialWorkflowConfig = defaultSocialConfig) {
    this.config = config
  }

  generateWeeklyBatch(targetAudience: string, weekStart: string): SocialPost[] {
    const posts: SocialPost[] = [
      {
        day: "Monday",
        platform: this.config.primaryPlatforms,
        audienceSegment: targetAudience,
        postCopy: this.generateEducationPost(targetAudience),
        pillar: "Education",
        ctaType: "Awareness"
      },
      {
        day: "Tuesday", 
        platform: this.config.primaryPlatforms,
        audienceSegment: targetAudience,
        postCopy: this.generateFAQPost(targetAudience),
        pillar: "FAQ",
        ctaType: "Awareness"
      },
      {
        day: "Wednesday",
        platform: this.config.primaryPlatforms,
        audienceSegment: targetAudience,
        postCopy: this.generateAuthorityPost(targetAudience),
        pillar: "Authority",
        ctaType: "Trust Building"
      },
      {
        day: "Thursday",
        platform: this.config.primaryPlatforms,
        audienceSegment: targetAudience,
        postCopy: this.generateObjectionPost(targetAudience),
        pillar: "Objection Breaker",
        ctaType: "Education"
      },
      {
        day: "Friday",
        platform: this.config.primaryPlatforms,
        audienceSegment: targetAudience,
        postCopy: this.generateCTAPost(targetAudience),
        pillar: "Lead Generation",
        ctaType: "Booking"
      }
    ]

    return posts.map(post => ({
      ...post,
      postCopy: post.postCopy + "\n\n" + this.config.complianceFooter
    }))
  }

  private generateEducationPost(audience: string): string {
    return `Understanding Living Benefits: Protection While You're Living

Many families in ${this.config.localMarketsFocus} think life insurance is only about death benefits. But modern policies offer something much more valuable: living benefits.

Living benefits allow you to access a portion of your death benefit if you're diagnosed with a critical illness like heart disease, cancer, or stroke. This means your policy can help pay medical bills, cover mortgage payments, or replace lost income while you focus on recovery.

With heart disease rates in our region nearly double the state average, this protection isn't just nice to have—it may be essential for preserving your family's financial stability during a health crisis.

The best part? These benefits are typically included at no extra cost in many modern policies. Your protection works for you whether you need it today or years from now.

True financial security isn't just about having a death benefit. It's about having protection that works for you while you're living, preserving your assets and dignity throughout your entire life.`
  }

  private generateFAQPost(audience: string): string {
    return `"Can I really access my life insurance while I'm alive?"

This is one of the most common questions we hear from families in ${this.config.localMarketsFocus}. The answer is yes—and it's more common than you might think.

Modern life insurance policies often include accelerated death benefits, also called living benefits. If you're diagnosed with a qualifying critical, chronic, or terminal illness, you can typically access 25% to 100% of your death benefit while you're still living.

Here's how it works:
• You're diagnosed with a qualifying condition
• Your insurance company reviews the claim
• Once approved, you receive a portion of your death benefit
• You can use these funds for any purpose—medical bills, mortgage payments, or daily expenses

The remaining death benefit stays in place for your beneficiaries. And in many cases, these benefits are included at no additional cost.

For families in our area, where health challenges can create immediate financial stress, this feature can mean the difference between keeping your home and losing everything to medical debt.

It's not just insurance—it's financial protection that adapts to life's unexpected challenges.`
  }

  private generateAuthorityPost(audience: string): string {
    return `Why I Focus on Education First

After years of serving families throughout ${this.config.serviceRegions}, I've learned that the best financial decisions come from understanding, not pressure.

That's why every conversation I have starts with education. Whether we're discussing living benefits, retirement planning, or protecting your family's future, my job is to help you understand your options clearly.

Too many families in our area have been sold products they didn't understand or didn't need. My approach is different:

✓ We start with your specific situation and goals
✓ I explain how different strategies work in plain language
✓ You get time to think and ask questions
✓ No pressure, no rush to decide

As an independent consultant, I'm not tied to any single company. This means I can recommend what's truly best for your family, not what's best for my commission.

Your financial security is too important for guesswork. When you understand your options, you can make confident decisions that protect what matters most.

That's the foundation of every relationship I build—trust through education, solutions through understanding.`
  }

  private generateObjectionPost(audience: string): string {
    return `"I'm young and healthy—why do I need life insurance now?"

I hear this often from young families in ${this.config.localMarketsFocus}. It's a fair question, and the answer might surprise you.

The truth is, being young and healthy is exactly why now is the perfect time to secure protection. Here's why:

**Lower Costs**: Your premiums are locked in at your current age and health. A 30-year-old pays significantly less than a 40-year-old for the same coverage.

**Guaranteed Insurability**: Health can change unexpectedly. Once you have coverage, it can't be taken away due to future health issues.

**Living Benefits**: Modern policies protect you while you're living. If you develop a critical illness, you can access benefits to maintain your lifestyle and protect your savings.

**Growing Families**: Young families often have the highest need for protection—mortgages, young children, and limited savings create significant financial vulnerability.

**Time Value**: Some policies build cash value that grows over time. Starting early gives you decades of potential accumulation.

The goal isn't to plan for the worst—it's to ensure the worst can't derail your family's future. Protection today means peace of mind tomorrow.`
  }

  private generateCTAPost(audience: string): string {
    return `Ready to Explore Your Protection Options?

If you're a family in ${this.config.localMarketsFocus} wondering about life insurance, living benefits, or retirement planning, I'd love to help you understand your options.

I offer free, no-pressure consultations where we can discuss:
• How living benefits can protect your family during health crises
• Strategies to supplement your retirement savings
• Ways to ensure your mortgage is protected
• Options that fit your budget and goals

Every conversation is educational first. My job is to help you understand what's available, not to pressure you into anything. You'll leave with clear information to make the best decision for your family.

We can meet virtually via Zoom or in person at your convenience. The consultation is completely free, and there's no obligation to move forward.

Your family's financial security deserves a conversation with someone who understands the unique challenges facing families in our area.

Ready to explore your options? Let's schedule a time to talk.`
  }

  generateVideoScript(topic: string, audience: string): VideoScript {
    return {
      hook: `Did you know your life insurance can help you while you're still alive?`,
      explanation: `Most people think life insurance only pays when you die. But modern policies include living benefits that let you access money if you're diagnosed with a critical illness like heart disease or cancer. Here in ${this.config.localMarketsFocus}, where health challenges are common, this can mean keeping your home instead of losing it to medical debt.`,
      cta: `Want to see if your current policy has these benefits? Book a free review and find out what protection you really have.`,
      alternativeHooks: [
        `What if your life insurance could pay your bills during a health crisis?`,
        `Here's why families in ${this.config.localMarketsFocus} need living benefits.`
      ]
    }
  }

  generateCanvaBrief(contentType: string, coreMessage: string): CanvaDesignBrief {
    return {
      designOverview: `Clean, professional design using navy and gold color scheme with shield and heartbeat elements. Focus on local Pennsylvania imagery and clear, readable typography.`,
      slides: [
        {
          slideNumber: 1,
          headline: coreMessage,
          supportingText: this.config.brandTagline,
          visualNotes: `Navy background with gold accent elements. Include shield logo with heartbeat line.`
        },
        {
          slideNumber: 2,
          headline: "Living Benefits Protection",
          supportingText: "Access your death benefit while living for critical illness",
          visualNotes: `Split layout with family photo on left, benefit icons on right`
        },
        {
          slideNumber: 3,
          headline: "Serving Pennsylvania Families",
          supportingText: this.config.serviceRegions,
          visualNotes: `Pennsylvania map outline with service counties highlighted`
        }
      ],
      ctaSlide: {
        ctaText: "Schedule Your Free Consultation",
        linkReference: this.config.ctaDestinationUrl
      },
      canvaNotes: `Use Canva's professional templates. Stick to navy (#2C3E50) and gold (#C49A6C) colors. Avoid gradients. Use clean, sans-serif fonts like Montserrat or Open Sans.`
    }
  }
}