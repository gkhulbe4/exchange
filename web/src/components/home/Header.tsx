import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { toast } from "sonner";

const Header = () => {
  const [userIdEntered, setUserIdEntered] = useState("");
  const userId = localStorage.getItem("userId");

  function signIn() {
    localStorage.setItem("userId", userIdEntered);
    toast.success("User signed in successfully");
    window.location.reload();
  }
  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className=" mx-auto px-4 pr-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between gap-10">
            <div className="flex items-center justify-between">
              <img
                className="h-16 w-16"
                src="https://static.vecteezy.com/system/resources/thumbnails/004/921/511/small/mountain-arrow-diagram-trading-business-marketing-logo-design-vector.jpg"
                alt="Logo"
              />
              <h1 className="text-2xl font-bold text-white font-mono">
                ZenithX
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to={"/market/SOL_USD"}>
                <Button variant="outline" className="bg-[#0d0d10]" size="sm">
                  Trade
                </Button>
              </Link>
              <Button variant="outline" className="bg-[#0d0d10]" size="sm">
                Futures
              </Button>
              <Button variant="outline" className="bg-[#0d0d10]" size="sm">
                Lend
              </Button>
              <Button variant="outline" className="bg-[#0d0d10]" size="sm">
                More
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {userId && (
              <Link to="/orders">
                <Button variant="outline" className="bg-[#0d0d10]" size="sm">
                  My Orders
                </Button>
              </Link>
            )}
            {userId ? (
              <Button
                onClick={() => {
                  localStorage.removeItem("userId");
                  toast.success("User signed out successfully");
                  window.location.reload();
                }}
                variant="outline"
                className="bg-[#dc2627]"
                size="sm"
              >
                Sign Out
              </Button>
            ) : (
              <div className="flex gap-3">
                <Input
                  className="bg-secondary border-border font-mono pr-12 focus:outline-none focus-visible:ring-2 focus-visible:!ring-purple-500"
                  type="text"
                  placeholder="Enter user Id"
                  value={userIdEntered}
                  onChange={(e) => setUserIdEntered(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key == "Enter" && userIdEntered.length != 0) {
                      signIn();
                    }
                  }}
                />
                <Button
                  onClick={signIn}
                  className="bg-purple-600 hover:bg-purple-700"
                  size="sm"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>{" "}
      </div>
    </header>
  );
};

export default Header;

{
  /* <div className="flex items-center gap-4">
            <Link to="/orders">
              <Button variant="outline" className="bg-[#151419]" size="sm">
                My Orders
              </Button>
            </Link>
            {userId ? (
              <Button variant="outline" className="bg-[#dc2627]" size="sm">
                Sign Out
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            )}
          </div> */
}
