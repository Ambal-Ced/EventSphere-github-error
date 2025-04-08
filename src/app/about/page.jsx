export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">About EventSphere</h1>

      <div className="max-w-3xl mx-auto">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At EventSphere, we're committed to transforming how people create,
            manage, and experience events. Our mission is to provide a seamless
            platform that connects event organizers with attendees, making the
            entire event lifecycle simple and enjoyable.
          </p>
          <p className="text-gray-700 mb-4">
            We believe that everyone should have access to powerful event
            management tools, whether you're organizing a small meetup or a
            large conference. Our platform is designed to be intuitive,
            flexible, and powerful enough to handle events of any size.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            EventSphere was founded in 2024 by a group of passionate event
            planners and technology enthusiasts who saw a gap in the market for
            a truly comprehensive event management solution.
          </p>
          <p className="text-gray-700 mb-4">
            After years of managing events using multiple disconnected tools,
            our founders came together to create a single platform that handles
            everything from event creation and promotion to ticketing and
            analytics.
          </p>
          <p className="text-gray-700 mb-4">
            Today, EventSphere is used by thousands of event organizers
            worldwide, helping them create memorable experiences for their
            attendees while simplifying the behind-the-scenes work.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Simplicity</h3>
              <p className="text-gray-700">
                We believe technology should make life easier, not more
                complicated. Our platform is designed to be intuitive and easy
                to use, without sacrificing power or flexibility.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-700">
                We're constantly exploring new ways to improve the event
                experience, from enhanced analytics to virtual event
                integration.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-700">
                We're building more than just a platform; we're creating a
                community of event professionals who share ideas, best
                practices, and support each other.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Reliability</h3>
              <p className="text-gray-700">
                Events are time-sensitive, and we understand the importance of a
                reliable platform. We're committed to providing a service you
                can count on, every time.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">The Team</h2>
          <p className="text-gray-700 mb-6">
            Our diverse team brings together expertise in event management,
            software development, user experience design, and customer support.
            We're united by our passion for creating exceptional event
            experiences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4"></div>
              <h3 className="font-bold">Justine Cedrick Ambal</h3>
              <p className="text-gray-600">Head Developer and Co-Designer</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4"></div>
              <h3 className="font-bold">Brylle Andrei Atienza</h3>
              <p className="text-gray-600">Head Designer and Co-Researcher</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mx-auto mb-4"></div>
              <h3 className="font-bold">Jude Maverick Manalo</h3>
              <p className="text-gray-600">
                Head of Researchs and Co-Developer
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-4">
            We'd love to hear from you! Whether you have questions about our
            platform, need help with your account, or want to share feedback,
            our team is here to help.
          </p>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="mb-2">
              <strong>Email:</strong> support@eventsphere.com
            </p>
            <p className="mb-2">
              <strong>Phone:</strong> (123) 456-7890
            </p>
            <p>
              <strong>Address:</strong> 123 Event Street, San Francisco, CA
              94103
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
