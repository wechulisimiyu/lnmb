"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function ContactFAQ() {
  return (
    <div className="mx-auto w-full lg:w-8/12">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible>
        <AccordionItem value="what">
          <AccordionTrigger>
            What is Leave No Medic Behind (LNMB)?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              This is a fundraising initiative started in 2017 with the aim of
              raising funds for school fees, accommodation and food for
              underprivileged medical students. In 2022, the idea was developed
              for a charity run to be organized to boost the funds drive.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="when-where">
          <AccordionTrigger>
            When and where is the run happening?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              The run is happening in October 2025. The starting point is KMTC
              field from 7:30 am. There is a 5km route and 10km route on race
              day. The event program will run till 2pm.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="who">
          <AccordionTrigger>Who is invited for the run?</AccordionTrigger>
          <AccordionContent>
            <p>
              Everyone is invited &mdash; tell your friends and family and
              invite them to come.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="signup">
          <AccordionTrigger>How do I sign up for the run?</AccordionTrigger>
          <AccordionContent>
            <p>
              You can sign up by visiting our{" "}
              <Link href="/" className="underline font-medium">
                page
              </Link>
              . All you need to do to attend the run is buy a LNMB t-shirt and
              show up on race day wearing the t-shirt.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="deadline">
          <AccordionTrigger>
            When is the deadline for online registration?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Registration closes on Friday 28th April at midnight. However, if
              you miss the deadline, you can still arrive on race day and buy a
              t-shirt at the venue.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="prices">
          <AccordionTrigger>How much are t-shirts?</AccordionTrigger>
          <AccordionContent>
            <p>
              If you are a university student, then t-shirts are sh 800 for
              round neck design and sh 1000 for polo neck design. If you are a
              non-student, then t-shirt prices are sh 1000 for round neck design
              and sh 2000 for polo neck design.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color-size">
          <AccordionTrigger>
            What is the color/size of the t shirts?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              The t-shirts are white in color. You can see some samples when you
              visit @amsunrunning on Instagram and Twitter. The sizes range from
              small to XXXL.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="pickup">
          <AccordionTrigger>
            Where and when can I pick my t-shirt?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              There are 2 pick up points for t-shirts: Chiromo UON campus and
              KNH UON campus. The pick-up points will be operational from 18th
              April and will run from 9am to 3pm every day. You will also be
              able to buy a t-shirt on site at the venue on race day.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="proxy-pickup">
          <AccordionTrigger>
            Can I send someone to pick a t-shirt on my behalf?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Yes, you can as long as you send them with the EQUITY BANK
              verification code/message.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="deliveries">
          <AccordionTrigger>Do you do deliveries?</AccordionTrigger>
          <AccordionContent>
            <p>
              At the moment no. You either need to pick your t shirt from the
              pick up point or send someone to pick it up on your behalf.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="mustbuy">
          <AccordionTrigger>
            Must I buy a t-shirt in order to participate in the run?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Yes. T-shirt sales is the main way in which we are raising money
              for the charity.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="oldshirt">
          <AccordionTrigger>
            Can I wear my t-shirt from last year to this year&apos;s run?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              We wouldn&apos;t advise you to wear last year&apos;s t-shirt to
              this year&apos;s run because the 2024 design will be fresh and new
              and you may prefer to buy the new t-shirt. Furthermore, t-shirt
              sales are the main source of income for the fund &mdash; buying a
              new t-shirt supports a needy medical student.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="support">
          <AccordionTrigger>
            Aside from buying t-shirts, how else can I support the run
            initiative?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              You can rent a booth at a fee to be a vendor at the charity
              run. Visit{" "}
              <Link href="/vendors" className="underline font-medium">
                here
              </Link>{" "}
              to sign up to be a vendor.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="volunteer-how">
          <AccordionTrigger>
            How do I volunteer to help with the run?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              If you are a medical student at the University of Nairobi, ask
              your class rep to give you more details on how to sign up as a
              volunteer. If you are a non-student and you would like to
              volunteer, simply send us a message at{" "}
              <a
                href="mailto:info@lnmb-run.org"
                className="underline font-medium"
              >
                info@lnmb-run.org
              </a>
              giving us your name, contact details and outlining that you would
              like to volunteer. Someone from our team will reach out to you
              shortly.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="not-available">
          <AccordionTrigger>
            What happens if I am not available to attend the run?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              No problem — you can still support the funds drive by buying the
              t-shirt. Visit our{" "}
              <Link href="/buy-tshirt" className="underline font-medium">
                page
              </Link>{" "}
              to buy a t-shirt.
            </p>
            <p className="mt-2">
              LIPA NA MPESA PAYBILL: <b>247247</b>
              <br />
              ACC NO: <b>0170280594893</b>
              <br />
              ACC NAME: <b>PROF HASSAN SAIDI EDUCATION MEMORIAL FUND</b>
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="funds-safe">
          <AccordionTrigger>
            How do I know that the funds collected under LNMB are safe and will
            actually go to a worthy cause?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              The Leave No Medic Behind initiative fund is housed by Kenya
              Medical Association (KMA) Nairobi Division where it is legally
              recognized as the Prof Hassan Saidi Education Memorial Fund. The
              bank account is managed by KMA whereby there are 3 signatories to
              the account who are all doctors. No medical student is a signatory
              to the account and none will ever be. A minimum of 2 signatories
              (of the 3 doctors who oversee) are required to sign before any
              funds are withdrawn from the account. All financial records and
              documents are carefully kept by KMA. The beneficiaries of the LNMB
              fund are vetted thoroughly before being admitted to the program
              and furthermore, funds for their school fees are disbursed
              directly to the University fees collection bank account while
              funds for food and accommodation are also disbursed directly to
              the University Mess and Hostels Of Residence bank accounts
              respectively.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="beneficiaries">
          <AccordionTrigger>
            Is LNMB only taking beneficiaries from University of Nairobi?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              LNMB is seeking to expand to take beneficiaries from other medical
              schools. For the 2024 cohort, we will include Mount Kenya
              University, Kenyatta University, Jomo Kenyatta University of
              Agriculture and Technology and Egerton University.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default ContactFAQ;
