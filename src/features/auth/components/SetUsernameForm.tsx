"use client";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/src/shared/ui/input";
import { authClient } from "@/src/configs/auth-client";
import { Button } from "@/src/shared/ui/button";
import { formatDate } from "@/src/shared/utils/formatDate";
import { generateUsernameSuggestions } from "@/src/shared/utils/generateUsernameSuggestions";

const SetUsernameForm = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const formattedDate = formatDate();

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Unauthorized", { description: formatDate() });
      router.push("/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session?.user) return;
    const displayName =
      session.user.name || session.user.email?.split("@")[0] || "";
    generateUsernameSuggestions(displayName)
      .then(setSuggestions)
      .catch(console.error);
  }, [session]);

  const handleSubmit = async () => {
    if (!username) return;
    setIsLoading(true);

    try {
      const { data: response, error: availabilityError } =
        await authClient.isUsernameAvailable({ username });

      if (!response?.available) {
        setIsAvailable(false);
        toast.error(availabilityError?.message ?? "Username not available", {
          description: formattedDate,
        });
        return;
      }

      setIsAvailable(true);
      const { error: updateError } = await authClient.updateUser({ username });

      if (updateError) {
        toast.error(updateError.message ?? "Something went wrong", {
          description: formattedDate,
        });
        return;
      }
      toast.success("Username created successfully", {
        description: formattedDate,
      });
      router.push("/tell-us-more");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || !session) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-foreground" />
          <span className="font-serif text-lg tracking-tight">Talentgate</span>
        </div>

        <div className="mb-7">
          <h1 className="text-2xl font-serif font-medium tracking-tight">
            Pick a username
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your unique handle on Talentgate
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="username"
                className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                Username
              </label>
              {isAvailable === true && (
                <span className="text-xs text-green-700">available</span>
              )}
              {isAvailable === false && (
                <span className="text-xs text-destructive">unavailable</span>
              )}
            </div>
            <Input
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setIsAvailable(null);
              }}
            />
          </div>

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setUsername(s);
                    setIsAvailable(null);
                  }}
                  className="text-xs px-2.5 py-1 rounded-full border border-stone-200 text-muted-foreground hover:border-stone-400 hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            This will be your public identity on Talentgate.
          </p>

          <Button
            onClick={handleSubmit}
            disabled={!username || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetUsernameForm;
