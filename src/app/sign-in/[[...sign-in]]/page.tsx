// import { SignIn } from "@clerk/nextjs";

// export default function Page() {
//     return (
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//             <SignIn />
//         </div>
//     );
// }
import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <SignIn />
            </div>
        </div>
    );
}
