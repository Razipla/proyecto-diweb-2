import { NavLink } from "react-router-dom";
import "../Layout.css";
interface DefaultLayoutProps {
    children: React.ReactNode;
}

export default function DefaultLAyout ({children}: DefaultLayoutProps) {
    return (
        <div>
            <header>
                <nav>
                    <ul>
                        <li>
                            <NavLink to = "/">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to= "/signup">Signup</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
        <main>{children}</main>
        </div>
    )
}