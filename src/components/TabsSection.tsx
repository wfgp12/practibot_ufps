import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export interface TabItem {
  label: string | React.ReactNode;
  value: string;
  content: React.ReactNode;
}

interface TabsSectionProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
}

export const TabsSection = ({ tabs, defaultValue, className }: TabsSectionProps) => {
  return (
    <Tabs defaultValue={defaultValue || tabs[0].value} className={`w-full ${className}`}>
      <TabsList className="flex w-fit mb-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="relative">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
