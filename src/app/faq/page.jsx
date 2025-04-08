"use client";

import { useState } from "react";

export default function FAQPage() {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (index) => {
    if (openItem === index) {
      setOpenItem(null);
    } else {
      setOpenItem(index);
    }
  };

  const faqItems = [
    {
      question: "What is EventSphere?",
      answer:
        "EventSphere is a comprehensive event management platform that allows you to create, manage, and attend events. Our platform provides tools for event hosting, ticket management, attendee tracking, and more.",
    },
    {
      question: "How do I create an account?",
      answer:
        "Creating an account is easy! Click on the 'Register' button in the top right corner of the page, enter your email address and password, and you're all set. You can also sign up using your Google or Facebook account for quicker access.",
    },
    {
      question: "Is EventSphere free to use?",
      answer:
        "EventSphere offers both free and premium plans. The free plan allows you to create basic events and sell tickets with a small service fee. Our premium plans offer additional features such as custom branding, advanced analytics, and reduced service fees.",
    },
    {
      question: "How do I create my first event?",
      answer:
        "After signing in, navigate to the 'My Events' page and click 'Create New Event'. Fill in the event details including title, date, location, description, and optionally add an event image. You can then publish your event and start selling tickets.",
    },
    {
      question: "Can I sell tickets through EventSphere?",
      answer:
        "Yes! EventSphere provides a complete ticketing solution. You can create different ticket types (e.g., General Admission, VIP), set prices, and manage sales. We handle secure payment processing and ticket delivery.",
    },
    {
      question: "How do attendees receive their tickets?",
      answer:
        "After purchasing tickets, attendees receive an email confirmation with their tickets attached. They can also access their tickets at any time by logging into their EventSphere account and going to the 'My Tickets' page.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "EventSphere accepts major credit cards (Visa, MasterCard, American Express), PayPal, and in certain regions, we support digital wallets like Apple Pay and Google Pay.",
    },
    {
      question: "How do I check in attendees at my event?",
      answer:
        "EventSphere offers multiple check-in options. You can use our mobile app to scan QR codes on tickets, or set up a check-in station with a tablet or computer to look up attendees by name or email.",
    },
    {
      question: "Can I issue refunds for tickets?",
      answer:
        "Yes, as an event organizer, you can issue full or partial refunds up until the date of the event. Navigate to your event dashboard, find the attendee, and click on the refund option.",
    },
    {
      question: "Does EventSphere work for virtual events?",
      answer:
        "Absolutely! EventSphere supports in-person, virtual, and hybrid events. For virtual events, you can integrate with popular video conferencing platforms like Zoom, Microsoft Teams, or use our built-in streaming solution.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h1>

      <div className="max-w-3xl mx-auto">
        <p className="text-gray-700 mb-8 text-center">
          Have questions about EventSphere? Find answers to commonly asked
          questions below. If you can't find what you're looking for, please
          contact our support team.
        </p>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md overflow-hidden"
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => toggleItem(index)}
              >
                <h3 className="font-medium">{item.question}</h3>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    openItem === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              <div
                className={`px-4 pb-4 ${
                  openItem === index ? "block" : "hidden"
                }`}
              >
                <p className="text-gray-700">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-700 mb-4">
            If you couldn't find the answer to your question, please don't
            hesitate to reach out to our support team. We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:support@eventsphere.com"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition text-center"
            >
              Email Support
            </a>
            <a
              href="/about#contact"
              className="inline-block bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition text-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
