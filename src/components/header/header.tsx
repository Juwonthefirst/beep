import Logo from "../logo";
import ProfileLink from "./profile-link";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4">
      <Logo />
      <ProfileLink />
    </header>
  );
};

export default Header;
