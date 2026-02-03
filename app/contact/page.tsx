// app/contact/page.tsx

import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero py-16">
        <div className="container-goddess text-center">
          <h1 className="font-display text-4xl md:text-5xl text-goddess-dark mb-4">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-goddess-gray max-w-xl mx-auto">
            Have a question or need help? We'd love to hear from you!
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-goddess">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-goddess-dark mb-1">Email Us</h3>
                    <p className="text-goddess-gray text-sm">hello@goddessessence.com</p>
                    <p className="text-goddess-gray text-sm">support@goddessessence.com</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-goddess-dark mb-1">Call Us</h3>
                    <p className="text-goddess-gray text-sm">+254718763226</p>
                    <p className="text-goddess-gray text-sm">Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-goddess-dark mb-1">Visit Us</h3>
                    <p className="text-goddess-gray text-sm">Nakuru</p>
                    <p className="text-goddess-gray text-sm">Nakuru cbd</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                <h2 className="font-display text-2xl text-goddess-dark mb-6">
                  Send us a message
                </h2>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-goddess-dark mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your first name"
                        className="input-goddess"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-goddess-dark mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your last name"
                        className="input-goddess"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-goddess-dark mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="input-goddess"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-goddess-dark mb-2">
                      Subject
                    </label>
                    <select className="input-goddess">
                      <option>General Inquiry</option>
                      <option>Order Support</option>
                      <option>Returns & Exchanges</option>
                      <option>Product Question</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-goddess-dark mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="How can we help you?"
                      className="input-goddess rounded-2xl"
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}