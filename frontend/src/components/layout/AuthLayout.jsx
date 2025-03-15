const AuthLayout = ({ rightSide , leftSide  }) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">{leftSide}</div>
      </div>

      {/* Right Side - Image or Placeholder */}
      <div className="hidden lg:flex items-center justify-center">
        {/* Example: Replace with an actual image */}
      {rightSide}
      </div>
    </div>
  );
};

export default AuthLayout;
