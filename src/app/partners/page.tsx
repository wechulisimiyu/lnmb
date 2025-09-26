import PartnersHero from "@/components/partners/hero";
import PartnersTitleSponsors from "@/components/partners/title-sponsors";
import PartnersGoldSponsors from "@/components/partners/gold-sponsors";
import PartnersSilverSponsors from "@/components/partners/silver-sponsors";
import PartnersCommunityPartners from "@/components/partners/community-partners";
import PartnersBenefits from "@/components/partners/benefits";
import PartnersCTA from "@/components/partners/cta";

export default function PartnersPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <PartnersHero />
        <PartnersTitleSponsors />
        <PartnersGoldSponsors />
        <PartnersSilverSponsors />
        <PartnersCommunityPartners />
        <PartnersBenefits />
        <PartnersCTA />
      </div>
    </div>
  );
}
