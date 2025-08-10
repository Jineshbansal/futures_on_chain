import SectionFour from "../components/Homepage/SectionFour";
import SectionThree from "../components/Homepage/SectionThree";
import SectionTwo from "../components/Homepage/SectionTwo";
import SectionOne from "../components/Homepage/sectionOne";
import Navbar from "./../components/Navbar";

const Homepage = () => {
  return (
    <>
      <div className="svg-background">
        <Navbar></Navbar>
        <SectionOne></SectionOne>
        <SectionTwo></SectionTwo>
        <SectionThree></SectionThree>
        <SectionFour></SectionFour>
      </div>
    </>
  );
};

export default Homepage;
