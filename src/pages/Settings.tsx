import { Component, onCleanup } from "solid-js";
import { createSignal } from "solid-js";
import themes from "./themes.json";
import { panicKey, setPanicKey } from "../util/panicKey";
import { CloakButton } from "../components/CloakButton";

export const Settings: Component = () => {
  const [selectedProxy, setSelectedProxy] = createSignal(
    localStorage.getItem("selectedProxy") || "ultraviolet"
  );
  const [selectedTheme, setSelectedTheme] = createSignal(
    localStorage.getItem("theme") || "navy"
  );

  const handleChange = (e: any) => {
    const selectedProxy = e.target.value;
    setSelectedProxy(selectedProxy);
    localStorage.setItem("selectedProxy", selectedProxy);
    window.location.reload();
  };

  const handleThemeChange = (e: any) => {
    const selectedTheme = e.target.value;
    setSelectedTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
    window.location.reload();
  };

  const handlePanicKeyChange = (e: any) => {
    const newPanicKey = e.target.value;
    setPanicKey(newPanicKey);
    localStorage.setItem("panicKey", newPanicKey);
  };

  return (
    <div class="max-h-0 p-4">
      <div class="my-2 text-3xl">Proxy Backend</div>
      <div class="mb-4">
        Choose the proxy that fits your needs. (Will refresh your page).
      </div>
      <select
        value={selectedProxy()}
        onChange={handleChange}
        class="border border-primary bg-black p-2 text-primary"
      >
        <option value="ultraviolet">Ultraviolet</option>
        <option value="dynamic">Dynamic</option>
      </select>

      <div class="my-2 text-3xl">Theme</div>
      <div class="mb-4">Choose a theme for Abyss.</div>
      <select
        value={selectedTheme()}
        onChange={handleThemeChange}
        class="border border-primary bg-black p-2 text-primary"
      >
        <option value="navy">Navy</option>
        <option value="black">Pitch black</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="violet">Violet</option>
        <option value="green">Green</option>
        <option value="yellow">Yellow</option>
      </select>

      <div class="my-2 text-3xl">Panic Key</div>
      <div class="mb-4">Choose a panic key to redirect to Google.</div>
      <input
        type="text"
        value={panicKey()}
        onInput={handlePanicKeyChange}
        class="border border-primary bg-black p-2 text-primary"
      />
      <div class="my-2 text-3xl">Cloaking</div>
      <div class="mb-4">Disguise this tab.</div>
      <div class="flex flex-row">
        <CloakButton title="Abyss" favicon="/../assets/logo.png" />
        <CloakButton title="Google" favicon="https://google.com/favicon.ico" />
        <CloakButton
          title="Google Docs"
          favicon="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"
        />
        <CloakButton
          title="Khan Academy"
          favicon="https://www.khanacademy.org/favicon.ico"
        />
        <CloakButton
          title="Google Classroom"
          favicon="https://ssl.gstatic.com/classroom/ic_product_classroom_32.png"
        />
      </div>
    </div>
  );
};
