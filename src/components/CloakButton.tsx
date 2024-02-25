import { applyPreset } from "../util/applyPreset";

interface CloakButtonProps {
  favicon: string;
  title: string;
}

export const CloakButton = (props: CloakButtonProps) => {
  return (
    <div
      class="ml-2 w-20 border bg-black p-2 text-center text-primary"
      onclick={() => applyPreset(props.favicon, props.title)}
    >
      {props.title}
    </div>
  );
};
