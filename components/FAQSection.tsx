"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "What types of cleaning services do you offer?",
      answer: "We offer a range of services, including residential cleaning, deep cleaning, move-in/move-out cleaning, and seasonal deep cleaning."
    },
    {
      question: "Are your cleaning products eco-friendly?",
      answer: "Yes, we prioritize using biodegradable, environmentally friendly cleaning products that are safe for both your family and pets."
    },
    {
      question: "How do I schedule a cleaning service?",
      answer: "Scheduling is easy! You can book directly through our website, call our customer support team, or message us on WhatsApp to pick a convenient time."
    },
    {
      question: "Do I need to be home during the cleaning?",
      answer: "Not at all. Many of our clients provide a spare key or access code so our trusted professionals can clean while you're at work or running errands."
    },
    {
      question: "What if I'm not satisfied with the cleaning?",
      answer: "We offer a 100% satisfaction guarantee. If you're unhappy with any area we cleaned, let us know within 24 hours and we'll re-clean it for free."
    }
  ];

  return (
    <section className="py-24 bg-white font-sans relative">
      <div className="max-w-4xl mx-auto px-5 md:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f0eefc] text-[#5b40cf] text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase">
            SPOTLESS - HOME SOLUTION
          </span>
          <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-[#1e1a4f] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, i) => (
            <details 
              key={i} 
              className="group bg-[#f8f7fa] rounded-[16px] overflow-hidden cursor-pointer border-l-[6px] border-[#5b40cf] shadow-sm transition-all duration-300" 
              open={i === 0}
            >
              <summary className="w-full px-5 sm:px-8 py-5 text-left flex items-center justify-between list-none focus:outline-none">
                <span className="font-semibold text-[#1e1a4f] text-[15px] sm:text-[17px] pr-8">{faq.question}</span>
                <div className="w-[30px] h-[30px] shrink-0 rounded-full bg-[#5b40cf] flex items-center justify-center transition-transform duration-300 group-open:rotate-180">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-5 sm:px-8 pb-6 pt-0 text-[#6B7280] text-[14px] sm:text-[15px] leading-relaxed w-full sm:w-[90%]">
                {faq.answer}
              </div>
            </details>
          ))}
          <style dangerouslySetInnerHTML={{__html: `details > summary::-webkit-details-marker { display: none; } details > summary { list-style: none; }`}} />
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-[#5b40cf] text-white rounded-[24px] p-8 md:p-12 text-center shadow-xl shadow-[#5b40cf]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <h3 className="text-2xl md:text-[28px] font-bold mb-4 flex items-center justify-center gap-2">
            Still have questions?
          </h3>
          <p className="text-white/90 font-medium mb-8 max-w-lg mx-auto leading-relaxed text-[15px]">
            Our friendly team is here to help! Get in touch and we'll respond faster than you can imagine.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact" 
              className="bg-white text-[#5b40cf] hover:bg-gray-50 px-8 py-3.5 rounded-full font-bold text-sm transition-colors shadow-sm w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Chat with Support
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
