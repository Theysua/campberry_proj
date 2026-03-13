export default function LegalPage({ type }) {
  const isPrivacy = type === 'privacy'

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 animate-fade-in">
      <div className="container max-w-3xl pt-16 pb-20">
        <div className="mb-10">
          <div className="text-xs font-bold text-[#892233] uppercase tracking-widest mb-3">Legal</div>
          <h1 className="text-4xl font-extrabold text-[#011936] mb-3">
            {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
          </h1>
          <p className="text-slate-500 text-sm">Last updated: February 24, 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 prose prose-slate max-w-none space-y-8 text-[#011936]">

          {isPrivacy ? (
            <>
              <section>
                <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
                <p className="text-slate-600 leading-relaxed">Campberry collects only the information necessary to provide our services. This includes information you voluntarily provide when creating an account (such as your name and email address), and usage data collected automatically (such as pages visited and search queries) to improve your experience.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">2. How We Use Your Information</h2>
                <p className="text-slate-600 leading-relaxed">We use your information to: provide and improve the Campberry platform, send you relevant program recommendations and deadline reminders (with your consent), and analyze aggregate usage patterns to improve content quality. We do not sell your personal data to any third parties, including the programs listed on our platform.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">3. Data Sharing</h2>
                <p className="text-slate-600 leading-relaxed">Your personal information is never shared with educational programs, counselors, or advertisers without your explicit consent. We may share anonymized, aggregate data with our content partners to improve program listings and ratings.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">4. Data Retention & Deletion</h2>
                <p className="text-slate-600 leading-relaxed">You may request deletion of your account and associated data at any time by contacting us at privacy@campberry.com. We will process your request within 30 days.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">5. Cookies</h2>
                <p className="text-slate-600 leading-relaxed">Campberry uses essential cookies to keep you logged in and remember your preferences. We do not use third-party tracking or advertising cookies.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">6. Contact</h2>
                <p className="text-slate-600 leading-relaxed">For privacy-related concerns, please contact us at <a href="mailto:privacy@campberry.com" className="text-[#892233] font-semibold hover:underline">privacy@campberry.com</a>.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
                <p className="text-slate-600 leading-relaxed">By accessing or using the Campberry platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">2. Use of the Platform</h2>
                <p className="text-slate-600 leading-relaxed">Campberry is a platform designed to help students discover extracurricular and enrichment opportunities. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the platform.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">3. Account Responsibilities</h2>
                <p className="text-slate-600 leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for any activity that occurs under your account. You must notify us immediately of any unauthorized use of your account.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">4. Content & Ratings</h2>
                <p className="text-slate-600 leading-relaxed">Program ratings and expert recommendations on Campberry reflect the opinions of our editorial team and community contributors. They are provided for informational purposes only and do not constitute professional admissions advice. Campberry does not guarantee admission to any program.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">5. Intellectual Property</h2>
                <p className="text-slate-600 leading-relaxed">The Campberry name, logo, and all content created by Campberry are the intellectual property of Campberry and may not be reproduced without written permission.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">6. Disclaimer of Warranties</h2>
                <p className="text-slate-600 leading-relaxed">Campberry is provided "as is" without warranties of any kind. We strive to maintain accurate and up-to-date program information, but we cannot guarantee the accuracy, completeness, or timeliness of any program listings.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">7. Changes to Terms</h2>
                <p className="text-slate-600 leading-relaxed">We may update these Terms of Service from time to time. We will notify you of significant changes via email or a prominent notice on our platform. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
              </section>
              <section>
                <h2 className="text-xl font-bold mb-3">8. Contact</h2>
                <p className="text-slate-600 leading-relaxed">For questions about these terms, contact us at <a href="mailto:legal@campberry.com" className="text-[#892233] font-semibold hover:underline">legal@campberry.com</a>.</p>
              </section>
            </>
          )}

          <div className="border-t border-slate-100 pt-6 text-sm text-slate-400">
            © 2026 Campberry. Built by teens and educators, for teens and educators.
          </div>
        </div>
      </div>
    </div>
  )
}
