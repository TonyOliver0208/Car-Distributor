import { MessageSquare } from "lucide-react";

const LoginPrompt = ({ openSignIn, t }) => (
  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-2 mb-6 flex items-center gap-3">
    <div className="bg-blue-100 p-2 rounded-full">
      <MessageSquare size={20} className="text-blue-500" />
    </div>
    <p className="text-sm text-gray-600">
      {t("ratingAndComment.please")}{" "}
      <span
        className="text-blue-600 cursor-pointer font-medium hover:underline"
        onClick={() => openSignIn({ redirectUrl: window.location.href })}
      >
        {t("ratingAndComment.logIn")}
      </span>{" "}
      {t("ratingAndComment.toLeaveReview")}
    </p>
  </div>
);

export default LoginPrompt;
