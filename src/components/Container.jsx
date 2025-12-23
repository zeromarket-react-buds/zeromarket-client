import clsx from "clsx";

const Container = function ({ children, className = "" }) {
  return (
    <div className={clsx("mx-auto w-full max-w-[600px] px-4 py-4", className)}>
      {children}
    </div>
  );
};

export default Container;
