import { cn } from "@/lib/utils";
import { IconEnum } from "@prisma/client";
import {
  BookOpen,
  Brain,
  Globe,
  Grid,
  Hand,
  Handshake,
  Heart,
  Layers,
  MapPin,
  MessageSquare,
  Rocket,
  Smile,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";

const getIcon = (icon: IconEnum, className?: string) => {
  const globalClassName = "h-5 w-5 text-primary";
  switch (icon) {
    case IconEnum.heart:
      return <Heart className={cn(globalClassName, className)} />;
    case IconEnum.brain:
      return <Brain className={cn(globalClassName, className)} />;
    case IconEnum.globe:
      return <Globe className={cn(globalClassName, className)} />;
    case IconEnum.rocket:
      return <Rocket className={cn(globalClassName, className)} />;
    case IconEnum.star:
      return <Star className={cn(globalClassName, className)} />;
    case IconEnum.hand:
      return <Hand className={cn(globalClassName, className)} />;
    case IconEnum.smile:
      return <Smile className={cn(globalClassName, className)} />;
    case IconEnum.thumbsUp:
      return <ThumbsUp className={cn(globalClassName, className)} />;
    case IconEnum.thumbsDown:
      return <ThumbsDown className={cn(globalClassName, className)} />;
    case IconEnum.people:
      return <Users className={cn(globalClassName, className)} />;
    case IconEnum.handshake:
      return <Handshake className={cn(globalClassName, className)} />;
    case IconEnum.mapPin:
      return <MapPin className={cn(globalClassName, className)} />;
    case IconEnum.sparkles:
      return <Sparkles className={cn(globalClassName, className)} />;
    case IconEnum.bookOpen:
      return <BookOpen className={cn(globalClassName, className)} />;
    case IconEnum.messageSquare:
      return <MessageSquare className={cn(globalClassName, className)} />;
    case IconEnum.layers:
      return <Layers className={cn(globalClassName, className)} />;
    case IconEnum.grid:
      return <Grid className={cn(globalClassName, className)} />;
    default:
      return <Users className={cn(globalClassName, className)} />;
  }
};

const getLabel = (icon: IconEnum) => {
  switch (icon) {
    case IconEnum.heart:
      return "Heart";

    case IconEnum.brain:
      return "Brain";
    case IconEnum.globe:
      return "Globe";
    case IconEnum.rocket:
      return "Rocket";
    case IconEnum.star:
      return "Star";
    case IconEnum.hand:
      return "Hand";
    case IconEnum.smile:
      return "Smile";
    case IconEnum.thumbsUp:
      return "Thumbs Up";
    case IconEnum.thumbsDown:
      return "Thumbs Down";
    case IconEnum.people:
      return "People";
    case IconEnum.handshake:
      return "Handshake";
    case IconEnum.mapPin:
      return "Map Pin";
    case IconEnum.sparkles:
      return "Sparkles";
    case IconEnum.bookOpen:
      return "Book Open";
    case IconEnum.messageSquare:
      return "Message Square";
    case IconEnum.layers:
      return "Layers";
    case IconEnum.grid:
      return "Grid";
    default:
      return "Users";
  }
};

export const iconEnum = {
  getIcon,
  getLabel,
};
