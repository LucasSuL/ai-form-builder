import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center align-middle p-20">
      <SignIn />
    </div>
  );
}