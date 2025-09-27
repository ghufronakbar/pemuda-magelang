import { SocialMediaPlatformEnum } from "@prisma/client";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaLinkedin,
  FaTiktok,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapPin,
  FaWhatsapp,
} from "react-icons/fa";
import { cn } from "@/lib/utils";

const getIcon = (platform: SocialMediaPlatformEnum, className?: string) => {
  const globalClassName = "h-5 w-5 text-primary";
  switch (platform) {
    case SocialMediaPlatformEnum.instagram:
      return <FaInstagram className={cn(globalClassName, className)} />;
    case SocialMediaPlatformEnum.twitter:
      return <FaTwitter className={cn(globalClassName, className)} />;
    case SocialMediaPlatformEnum.facebook:
      return <FaFacebook className={cn(globalClassName, className)} />;
    case SocialMediaPlatformEnum.youtube:
      return <FaYoutube className={cn(globalClassName, className)} />;
    case SocialMediaPlatformEnum.linkedin:
      return <FaLinkedin className={cn(globalClassName, className)} />;
    case SocialMediaPlatformEnum.tiktok:
      return <FaTiktok className={cn(globalClassName, className)} />;
    case SocialMediaPlatformEnum.website:
      return <FaGlobe className={cn(globalClassName, className)} />;
    case SocialMediaPlatformEnum.email:
      return <FaEnvelope className={cn(globalClassName, className)} />;
    case SocialMediaPlatformEnum.phone:
      return <FaPhone className={cn(globalClassName, className)} />;
    case SocialMediaPlatformEnum.address:
      return <FaMapPin className={cn(globalClassName, className)} />;
    case SocialMediaPlatformEnum.whatsapp:
      return <FaWhatsapp className={cn(globalClassName, className)} />;
    default:
      return <FaGlobe className={cn(globalClassName, className)} />;
  }
};

const getLabel = (platform: SocialMediaPlatformEnum) => {
  switch (platform) {
    case SocialMediaPlatformEnum.instagram:
      return "Instagram";
    case SocialMediaPlatformEnum.twitter:
      return "Twitter";
    case SocialMediaPlatformEnum.facebook:
      return "Facebook";
    case SocialMediaPlatformEnum.youtube:
      return "YouTube";
    case SocialMediaPlatformEnum.linkedin:
      return "LinkedIn";
    case SocialMediaPlatformEnum.tiktok:
      return "TikTok";
    case SocialMediaPlatformEnum.website:
      return "Website";
    case SocialMediaPlatformEnum.email:
      return "Email";
    case SocialMediaPlatformEnum.phone:
      return "Phone";
    case SocialMediaPlatformEnum.address:
      return "Address";
    case SocialMediaPlatformEnum.whatsapp:
      return "WhatsApp";
    default:
      return "Website";
  }
};

export const socialMediaPlatformEnum = {
  getIcon,
  getLabel,
};
