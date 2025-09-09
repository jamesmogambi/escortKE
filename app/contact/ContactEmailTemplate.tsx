// components/email-template.tsx
interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate = ({ name, email, message }: EmailTemplateProps) => (
  <div className="bg-gray-100 text-gray-800 font-sans p-6">
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        📩 New Contact Form Submission
      </h2>

      <div className="mb-2">
        <span className="font-medium text-gray-700">Name:</span> {name}
      </div>
      <div className="mb-2">
        <span className="font-medium text-gray-700">Email:</span> {email}
      </div>

      <div className="mt-6">
        <p className="font-medium text-gray-700 mb-2">Message:</p>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 whitespace-pre-wrap text-sm text-gray-700">
          {message}
        </div>
      </div>

      <footer className="mt-8 text-xs text-gray-500">
        This message was sent via your website contact form.
      </footer>
    </div>
  </div>
);
