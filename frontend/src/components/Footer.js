import React from "react";

const Footer = () => {
  return (
    <>
      <div className="p-6 bg-gray-900 text-white border-t border-gray-700">
        {/* Footer details */}
        <footer className="p-6 mt-6  text-center">
          <div className="space-y-2">
            <p className="text-sm text-white">&copy; 2024 Quizify. All rights reserved.</p>
            <p className="text-sm white">1234 Quiz Street, Quiz City, QC 56789</p>
            <p className="text-sm text-gray-400 cursor-pointer">
              <span  href="mailto:contact@quizify.com" className="text-blue-500 hover:underline">contact@quizify.com</span> | 
              <span href="tel:+1234567890" className="text-blue-500 hover:underline"> +1 (234) 567-890</span>
            </p>
            <p className="text-sm text-gray-400 cursor-pointer">
              <span href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</span> | 
              <span href="/terms-of-service" className="text-blue-500 hover:underline"> Terms of Service</span>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
