const NavbarSkeleton = () => {
  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-md animate-pulse">
      <nav className="flex flex-row justify-between items-center max-w-7xl mx-auto p-5">
        {/* Left Section */}
        <div className="flex items-center justify-center gap-12">
          {/* Logo */}
          <div className="h-8 w-40 rounded-md bg-gray-200" />

          {/* Nav Links */}
          <div className="flex flex-row items-center justify-center gap-x-8">
            <div className="h-5 w-24 rounded bg-gray-200" />
            <div className="h-5 w-20 rounded bg-gray-200" />
            <div className="h-5 w-24 rounded bg-gray-200" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-row items-center justify-center gap-x-5">
          {/* Search Input */}
          <div className="w-sm h-8 rounded-lg bg-gray-200" />

          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-gray-400" />
        </div>
      </nav>
    </header>
  );
};

export default NavbarSkeleton;
