import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Shield, Clock, Award } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { useToast } from "@/hooks/use-toast";
import { useConsultationModal } from "@/contexts/ConsultationModalContext";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  monthlyBudget: z.string().min(1, "Please select your monthly budget"),
  businessGoals: z.string().min(10, "Please provide more details about your business goals"),
  challenges: z.string().min(10, "Please provide more details about your challenges"),
});

interface ConsultationFormProps {
  isModal?: boolean;
  onSuccess?: () => void;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ isModal = false, onSuccess }) => {
  const { createLead, isCreating } = useLeads(false);
  const { toast } = useToast();
  const { setStep, setLeadData } = useConsultationModal();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      monthlyBudget: "",
      businessGoals: "",
      challenges: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createLead(values);
      
      // Store lead data for Calendly prefill
      setLeadData({
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        company: values.companyName,
        budget: values.monthlyBudget,
        goals: values.businessGoals,
        challenges: values.challenges,
      });
      
      toast({
        title: "Information Received!",
        description: "Now let's schedule your consultation...",
      });
      
      form.reset();
      
      // If in modal, move to scheduling step
      if (isModal) {
        setStep('scheduling');
      } else {
        // If not in modal, just call onSuccess
        onSuccess?.();
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };
  const CardWrapper = isModal ? 'div' : Card;
  const HeaderWrapper = isModal ? 'div' : CardHeader;
  const ContentWrapper = isModal ? 'div' : CardContent;

  return (
    <CardWrapper className={isModal ? '' : undefined}>
      <HeaderWrapper className={isModal ? 'text-center mb-6' : undefined}>
        {!isModal && (
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        )}
        <CardTitle className={`text-center ${isModal ? 'text-2xl mb-2' : ''}`}>
          Get Your Free Process Consultation
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Discover how we can transform your business with our proven process optimization strategies.
        </p>
      </HeaderWrapper>
      <ContentWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+1 (847) 275-8758" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Under $1,000">Under $1,000</SelectItem>
                      <SelectItem value="$1,000 - $5,000">$1,000 - $5,000</SelectItem>
                      <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="$10,000 - $25,000">$10,000 - $25,000</SelectItem>
                      <SelectItem value="$25,000+">$25,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Goals & Objectives *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your primary business goals and what you hope to achieve..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Challenges *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What are the main challenges you're facing in your business right now?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" size="lg" disabled={isCreating}>
              <Calendar className="w-4 h-4 mr-2" />
              {isCreating ? "Submitting..." : "Schedule Free Consultation"}
            </Button>
          </form>
        </Form>

        {/* Trust Indicators */}
        <div className="text-center pt-6 mt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Free consultation
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              No obligations
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Proven results
            </div>
          </div>
        </div>
      </ContentWrapper>
    </CardWrapper>
  );
};