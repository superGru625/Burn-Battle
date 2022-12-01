import style from "./style.module.scss";

interface Props {
  alignment?: "left" | "center" | "right";
}

export default function Logo(props: Props) {
  return (
    <img
      classList={{
        [style.logo]: true,
        [style.left]: props.alignment == "left",
        [style.center]: props.alignment == "center",
        [style.right]: props.alignment == "right",
      }}
      src="logo.svg"
      draggable={false}
    />
  );
}
