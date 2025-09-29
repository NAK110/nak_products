import { Sparkle } from "lucide-react";
// import LoginForm from "@/components/auth/Login";
import { RegisterForm } from "@/components/auth/Register2";
import productImage from "@/assets/img/ProductImage.jpg";
import motorcycle from "@/assets/img/Motorcycle.jpg";
import tech from "@/assets/img/TechProduct.jpg";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Carousel
          className="h-full w-full"
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselContent className="h-full">
            <CarouselItem className="relative h-screen">
              <img
                src={productImage}
                alt="Product Image"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </CarouselItem>
            <CarouselItem className="relative h-screen">
              <img
                src={motorcycle}
                alt="Motorcycle Image"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </CarouselItem>
            <CarouselItem className="relative h-screen">
              <img
                src={tech}
                alt="Tech Image"
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
              <Sparkle className="size-6" />
            </div>
            Luxora Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
