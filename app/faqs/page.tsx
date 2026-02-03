// app/faqs/page.tsx

export default function FAQsPage() {
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business day delivery."
    },
    {
      question: "What is your return policy?",
      answer: "We offer 30-day returns on all unworn items with tags attached. See our Returns page for details."
    },
    {
      question: "How do I track my order?",
      answer: "Once shipped, you'll receive an email with tracking information. You can also track orders in your account."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes! We ship to most countries worldwide. Shipping costs are calculated at checkout."
    },
    {
      question: "How do I find my size?",
      answer: "Check our Size Guide for detailed measurements. If you're between sizes, we recommend sizing up."
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-hero py-16">
        <div className="container-goddess text-center">
          <h1 className="font-display text-4xl md:text-5xl text-goddess-dark mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-goddess max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="font-semibold text-goddess-dark mb-2">{faq.question}</h3>
                <p className="text-goddess-gray">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}