import { Progress } from "antd";

interface LoadingScreenProps {
  percent: number;
}

export const LoadingScreen = (props: LoadingScreenProps) => {
  const {percent}=props;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10, // Ensures it's on top
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black", // Semi-transparent background
      }}
    >
      <div>
        <Progress
          percent={percent}
          percentPosition={{ align: "center", type: "inner" }}
          size={[300, 20]}
          strokeColor="#001342"
        />
      </div>
    </div>
  );
};
