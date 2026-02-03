// app/size-guide/page.tsx

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-hero py-16">
        <div className="container-goddess text-center">
          <h1 className="font-display text-4xl md:text-5xl text-goddess-dark mb-4">
            Size <span className="text-gradient">Guide</span>
          </h1>
          <p className="text-goddess-gray max-w-xl mx-auto">
            Find your perfect fit with our comprehensive size guide.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-goddess max-w-4xl">
          <div className="card p-8">
            <h2 className="font-display text-2xl text-goddess-dark mb-6">Women's Sizes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-primary-200">
                    <th className="py-3 px-2 text-goddess-dark">Size</th>
                    <th className="py-3 px-2 text-goddess-dark">US</th>
                    <th className="py-3 px-2 text-goddess-dark">Bust (in)</th>
                    <th className="py-3 px-2 text-goddess-dark">Waist (in)</th>
                    <th className="py-3 px-2 text-goddess-dark">Hips (in)</th>
                  </tr>
                </thead>
                <tbody className="text-goddess-gray">
                  <tr className="border-b border-goddess-muted">
                    <td className="py-3 px-2 font-medium">XS</td>
                    <td className="py-3 px-2">0-2</td>
                    <td className="py-3 px-2">32-33</td>
                    <td className="py-3 px-2">24-25</td>
                    <td className="py-3 px-2">34-35</td>
                  </tr>
                  <tr className="border-b border-goddess-muted">
                    <td className="py-3 px-2 font-medium">S</td>
                    <td className="py-3 px-2">4-6</td>
                    <td className="py-3 px-2">34-35</td>
                    <td className="py-3 px-2">26-27</td>
                    <td className="py-3 px-2">36-37</td>
                  </tr>
                  <tr className="border-b border-goddess-muted">
                    <td className="py-3 px-2 font-medium">M</td>
                    <td className="py-3 px-2">8-10</td>
                    <td className="py-3 px-2">36-37</td>
                    <td className="py-3 px-2">28-29</td>
                    <td className="py-3 px-2">38-39</td>
                  </tr>
                  <tr className="border-b border-goddess-muted">
                    <td className="py-3 px-2 font-medium">L</td>
                    <td className="py-3 px-2">12-14</td>
                    <td className="py-3 px-2">38-40</td>
                    <td className="py-3 px-2">30-32</td>
                    <td className="py-3 px-2">40-42</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-medium">XL</td>
                    <td className="py-3 px-2">16-18</td>
                    <td className="py-3 px-2">41-43</td>
                    <td className="py-3 px-2">33-35</td>
                    <td className="py-3 px-2">43-45</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-4 bg-primary-50 rounded-xl">
              <p className="text-sm text-goddess-gray">
                <strong className="text-goddess-dark">Tip:</strong> If you're between sizes, 
                we recommend sizing up for a more comfortable fit. Still unsure? 
                Contact us and we'll help you find your perfect size!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}