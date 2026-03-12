import { ArrowLeftIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const NotFound = () => {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading mb-4 text-4xl font-bold sm:text-5xl">404</h1>
      <h2 className="mb-4 text-xl">Halaman Tidak Ditemukan</h2>

      <ButtonLink to={"/"} variant="primary">
        <ArrowLeftIcon className="mr-2 size-4" />
        Kembali ke Beranda
      </ButtonLink>
    </div>
  );
};

export default NotFound;
