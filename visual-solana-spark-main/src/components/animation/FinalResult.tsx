interface FinalResultProps {
  digit: number;
}

export const FinalResult = ({ digit }: FinalResultProps) => {
  return (
    <div className="animate-explode">
      <span className="text-9xl font-mono font-bold text-white">
        {digit}
      </span>
    </div>
  );
};
