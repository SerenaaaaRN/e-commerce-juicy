import { SonnerDemo } from "@/components/common/SonnerDemo";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { ReactNode } from "react";

const Box = ({ children }: { children: ReactNode }) => {
  return <div className="flex items-center justify-center p-4 ring">{children}</div>;
};

const DemoPage = () => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 px-4 py-8 ring md:grid-cols-3">
      <Box>
        <SonnerDemo />
      </Box>

      <Box>
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle>Small Card</CardTitle>
            <CardDescription>This card uses the small size variant.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The card component supports a size prop that can be set to &quot;sm&quot; for a more compact appearance.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Action
            </Button>
          </CardFooter>
        </Card>
      </Box>

      <Box>
        <Input placeholder="Enter Text" />
      </Box>
    </div>
  );
};

export default DemoPage;
