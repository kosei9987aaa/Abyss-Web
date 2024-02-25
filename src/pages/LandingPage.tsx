import { Component } from "solid-js";
import Logo from "../assets/logo.png";
import { Shortcut } from "../components/Shortcut";
import {
  IconBrandDiscordFilled,
  IconBrandYoutubeFilled,
  IconBrandTiktok
} from "@tabler/icons-solidjs";
import { SiRoblox } from "solid-icons/si";

export const LandingPage: Component = () => {
  return (
    <div class="flex h-full flex-col items-center justify-center md:flex-row">
      <img src={Logo} class="w-72 md:w-96" alt="Logo" />
      <div class="flex flex-col items-center md:items-start">
        <div class="mb-4 text-center text-4xl text-primary md:text-left md:text-7xl">
          Abyss
        </div>
        <div class="text-center text-lg text-primary md:text-left md:text-4xl">
          Join the{" "}
          <a href="https://discord.gg/goabyss" class="underline">
            Discord
          </a>
          !
        </div>
        <div class="flex flex-row">
          <Shortcut
            icon={<IconBrandDiscordFilled class="h-full w-full" />}
            url="https://discord.com"
          />
          <Shortcut
            icon={<SiRoblox class="h-full w-full" />}
            url="https://nowgg.nl/"
          />
          <Shortcut
            icon={<IconBrandYoutubeFilled class="h-full w-full" />}
            url="https://youtube.com"
          />
          <Shortcut
            icon={<IconBrandTiktok class="h-full w-full" />}
            url="https://tiktok.com"
          />
        </div>
      </div>
    </div>
  );
};
