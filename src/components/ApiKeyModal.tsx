import { useState } from "react";
import { useApiKey } from "@/context/ApiKeyContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const ApiKeyModal = () => {
  const { apiKey, setApiKey } = useApiKey();
  const [localKey, setLocalKey] = useState("");

  const handleSave = () => {
    if (localKey.trim()) {
      setApiKey(localKey.trim());
    }
  };

  return (
    <Dialog open={!apiKey}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Groq API Key Required</DialogTitle>
          <DialogDescription>
            Please enter your Groq API key to use the AI features. You can get a
            free key from the Groq console.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <Input
              id="api-key"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              className="col-span-3"
              placeholder="gsk_..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};