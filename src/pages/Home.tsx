import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, SparkleIcon } from "lucide-react";

const Home = () => {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex flex-col items-start gap-4">
        <Badge variant="secondary" className="px-4 py-1.5 text-sm">
          <SparkleIcon className="text-primary mr-2 size-4" />
          Starter Kit
        </Badge>

        <h1 className="text-4xl font-bold">Hello Rillah</h1>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="w-full gap-2 sm:w-auto">
            Mulai Coding <ArrowRightIcon className="size-4" />
          </Button>
          <Button size="lg" variant="secondary" className="w-full gap-2 sm:w-auto">
            Dokumentasi
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Home;
