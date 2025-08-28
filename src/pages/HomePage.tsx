import MarketingLayout from "../layouts/MarketingLayout";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import TeamSection from "../components/sections/TeamSection";
import FAQSection from "../components/sections/FAQSection";
import ContactSection from "../components/sections/ContactSection";
import Divider from "../components/ui/Divider";

const HomePage = () => {
  return (
    <MarketingLayout>
      <HeroSection />
      <FeaturesSection />
      <Divider />
      <TeamSection />
      <Divider />
      <FAQSection />
      <Divider />
      <ContactSection />
    </MarketingLayout>
  );
};

export default HomePage;