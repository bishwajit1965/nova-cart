import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/u";

const FAQ = () => {
  return (
    <section className="max-w-3xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How do I track my order?</AccordionTrigger>
          <AccordionContent>
            Once your order ships, you’ll receive a tracking link via email. You
            can also log into your account and view your order status anytime.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            What payment methods do you accept?
          </AccordionTrigger>
          <AccordionContent>
            We accept major credit/debit cards, PayPal, and mobile payment
            options. More methods will be added soon!
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Can I return or exchange items?</AccordionTrigger>
          <AccordionContent>
            Yes! We offer hassle-free returns and exchanges within 14 days of
            delivery. Please ensure the items are unused and in original
            condition.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Do you offer international shipping?
          </AccordionTrigger>
          <AccordionContent>
            Currently, we ship within select regions. International shipping
            will be available soon. Stay tuned for updates!
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default FAQ;
