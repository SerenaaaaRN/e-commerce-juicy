import { Button } from "@/components/atoms/button";

const HomePage = () => {
  return (
    <div className="">
      <section className="flex flex-col items-center justify-center gap-4 text-center py-20 bg-muted/20 rounded-lg">
        <h1 className="text-4xl font-bold tracking-tight">Selamat Datang di TokoSerena</h1>
        <p className="text-muted-foreground max-w-lg">
          Platform e-commerce modern untuk kebutuhan belanjamu. Coba cek fitur baru kami sekarang.
        </p>
        <div className="flex gap-4">
          <Button>Belanja Sekarang</Button>
          <Button variant="outline">Pelajari Lebih Lanjut</Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
