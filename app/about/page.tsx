// app/about/page.tsx

import { Heart, Sparkles, Leaf, Users } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Made with Love",
      description: "Every piece is carefully curated with our customers in mind.",
    },
    {
      icon: Sparkles,
      title: "Quality First",
      description: "We source only the finest materials for lasting beauty.",
    },
    {
      icon: Leaf,
      title: "Sustainable Fashion",
      description: "Committed to eco-friendly practices and ethical sourcing.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built by women, for women who embrace their inner goddess.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container-goddess text-center">
          <span className="font-script text-4xl text-primary-500">Our Story</span>
          <h1 className="font-display text-4xl md:text-5xl text-goddess-dark mt-4 mb-6">
            About <span className="text-gradient">Goddess Essence</span>
          </h1>
          <p className="text-goddess-gray max-w-2xl mx-auto text-lg">
            We believe every woman deserves to feel confident, beautiful, and 
            powerful. That's why we create fashion that celebrates your unique essence.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white">
        <div className="container-goddess">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-script text-2xl text-primary-500">Our Mission</span>
              <h2 className="font-display text-3xl text-goddess-dark mt-2 mb-4">
                Empowering Women Through Fashion
              </h2>
              <p className="text-goddess-gray mb-4">
                Goddess Essence was born from a simple idea: fashion should make you 
                feel amazing. We're not just selling clothes – we're helping women 
                discover and express their unique style.
              </p>
              <p className="text-goddess-gray">
                From our carefully curated collections to our exceptional customer 
                service, everything we do is designed to make your shopping experience 
                as beautiful as the clothes you'll wear.
              </p>
            </div>
            <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl flex items-center justify-center">
              <span className="font-script text-6xl text-primary-300">GE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-goddess-light">
        <div className="container-goddess">
          <div className="text-center mb-12">
            <span className="font-script text-2xl text-primary-500">What We Stand For</span>
            <h2 className="font-display text-3xl text-goddess-dark mt-2">
              Our Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <value.icon size={28} className="text-primary-500" />
                </div>
                <h3 className="font-semibold text-goddess-dark mb-2">{value.title}</h3>
                <p className="text-goddess-gray text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}