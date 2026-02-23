import SectionCard from "@/components/SectionCard";
import React from "react";

interface SectionArticleProps {
  className?: string;
}

// const SectionArticle: React.FC<SectionArticleProps> = ({ className = "" }) => {
//   return (
//     <article className={` mx-auto px-4 py-8 ${className}`}>
//       <SectionCard>
//         {/* section */}
//         <div className="font-semibold">
//           <h2 className="text-xl mb-3 font-normal gap-3 flex items-center "></h2>

//           <p className="my-5">
//             Starting and running a business in the adult industry can be
//             difficult for a variety of reasons. First and foremost, there is a
//             lot of stigma and negative perception surrounding the industry.
//             Despite this, many businesses are successful and thriving in the
//             adult industry. This is often because the demand for adult
//             entertainment is high and there are many ways to reach customers
//             despite all the challenges. Let’s take a look at some successful
//             businesses here in the US.
//           </p>
//         </div>

//         {/* section */}
//         <div className="font-semibold space-y-5">
//           <h2 className="text-xl   ">Erotic businesses</h2>
//           <p>
//             First, let's talk about what erotic establishments are. As mentioned
//             above, they are places that are exclusively for adults. They offer{" "}
//             <span className=" text-primary"> erotic services </span>, but you
//             can also go here for{" "}
//             <span className="text-primary ">an erotic massage</span> , a nice
//             lap dance, to have fun with a large number of people in one night,
//             or if you want, for a dose of real humiliation. What are we talking
//             about? Check out the overview below.
//           </p>
//         </div>

//         {/* section */}
//         <div className="font-semibold space-y-5 mt-5">
//           <h2 className="text-xl   ">Erotic massages</h2>
//           <p>
//             There are many types of{" "}
//             <span className=" text-primary">erotic massages</span> that people
//             can enjoy. One of the most popular is{" "}
//             <span className=" text-primary">tantric massage</span>, which is
//             based on Indian philosophy. The main goal of the massage is to
//             awaken and strengthen sexual energy and deepen the connection with
//             yourself and/or your partner. Another type that has been very
//             popular recently is <span className=" text-primary">nuru</span>{" "}
//             massage, which comes from Japan and is performed using a
//             body-on-body technique using a special gel. All of these massages
//             (and many, many more) are performed in specialized massage parlors,
//             where trained masseuses will take care of you so that you can enjoy
//             a sensual experience to the fullest.
//           </p>
//         </div>

//         {/* section */}
//         <div className="font-semibold space-y-5 mt-5">
//           <h2 className="text-xl   ">Erotic private rooms</h2>

//           <p>
//             Come and enjoy your time with professional sex workers in{" "}
//             <span className="text-primary">erotic private rooms</span>, who will
//             make you forget about everyday stresses and private rooms , who will
//             make you forget about everyday stresses and tensions through{" "}
//             <span className=" text-primary">erotic massage</span>, oral sex, sex
//             or otherwise. Enjoy these moments together, you can enjoy them in
//             the private apartment or suite of the lady you are visiting. This
//             eliminates the additional stress of meeting someone or exchanging
//             clicks with her previous client.
//           </p>
//         </div>

//         {/* section */}
//         <div className="font-semibold space-y-5 mt-5">
//           <h2 className="text-xl">Hour hotel</h2>

//           <p>
//             <span className="text-primary">A love hotel</span> , sometimes
//             referred to as a love hotel, is a place that offers short-term
//             accommodation, most often for couples, lovers or individuals who are
//             looking for a discreet and private place for an intimate meeting or
//             relaxation. The hotels can be found in larger Kenyan cities and are
//             often equipped with themed or luxurious rooms with various amenities
//             and features that provide an intimate atmosphere. These hotels may
//             offer various options such as large beds, jacuzzis, mirrored walls,
//             themed lighting, audiovisual systems, erotic games and other
//             elements that contribute to an erotic or romantic environment.
//           </p>
//         </div>

//         {/* section */}
//         <div className="font-semibold space-y-5 mt-5">
//           <h2 className="text-xl   ">Night clubs</h2>

//           <p>
//             <span className="text-primary">Night clubs</span> are establishments
//             that are aimed at an adult audience and offer music, a dance floor,
//             and often young and beautiful women. Therefore, these clubs are
//             often also called strip clubs, erotic clubs, or gentleman's clubs.
//             In nightclubs, dancers perform erotic dances,{" "}
//             <span className="text-primary">striptease</span>, or other
//             attractive performances. Some clubs also offer private or VIP rooms
//             where you can get even more intimate interaction with the dancers or
//             strippers.
//           </p>
//         </div>
//         {/* section */}

//         <div className="font-semibold space-y-5 mt-5">
//           <h2 className="text-xl   ">Swingers clubs</h2>
//           <p>
//             <span className="text-primary">Swingers clubs</span> are a great
//             place to meet other couples or individuals who are into this
//             lifestyle. <span className="">SWingers</span> clubs allow
//             participants to meet other couples or individuals who are also open
//             to swapping partners. Clubs usually offer a variety of rooms, such
//             as themed rooms, private rooms, or public areas with beds or other
//             facilities for intimate activities. You will also find other
//             facilities, such as saunas, jacuzzis, dance floors, or bars, that
//             contribute to the relaxed atmosphere. Clubs often require certain
//             rules to be followed, which include respect for privacy, consent,
//             and safe sexual behavior.
//           </p>
//         </div>

//         {/* section */}
//         <div className="font-semibold space-y-5 mt-5">
//           <h2 className="text-xl   ">BDSM studios</h2>
//           <p>
//             BDSM studios offer equipment for practicing BDSM activities. These
//             studios usually have specially designed rooms that are equipped with
//             various <span className="text-primary">BDSM </span> accessories. For
//             example, you can find handcuffs, whips, muzzles, nipple clamps,
//             ropes, leather and latex clothing,
//             <span className="text-primary">bondage </span> crosses, or other
//             accessories for fulfilling various fetishes. Studios often offer the
//             opportunity to pay for the services of professional dominatrixes.
//           </p>
//         </div>
//       </SectionCard>
//     </article>
//   );
// };

const SectionArticle: React.FC<SectionArticleProps> = ({ className = "" }) => {
  return (
    <article className={` mx-auto px-4 py-8 ${className}`}>
      <SectionCard>
        {/* section */}
        <p className="font-semibold my-5">
          Starting and running a business in the adult industry can be difficult
          for a variety of reasons. First and foremost, there is a lot of stigma
          and negative perception surrounding the industry. Despite this, many
          businesses are successful and thriving in the adult industry. This is
          often because the demand for adult entertainment is high and there are
          many ways to reach customers despite all the challenges. Let’s take a
          look at some successful businesses here in the US.
        </p>
        {/*Agency section */}
        <div className="font-semibold space-y-5 mt-7">
          <h2 className="text-xl font-light">Agencies</h2>
          <p>
            Agencies serve as professional intermediaries connecting clients
            with verified service providers. These organizations typically offer
            a curated selection of companions, ensuring quality, safety, and
            discretion for both parties. Agencies handle screening processes,
            scheduling, and often provide detailed profiles with verified photos
            and descriptions. Many{" "}
            <span className="text-primary">agencies</span> specialize in
            specific types of services or{" "}
            <span className="text-primary">companion styles</span>, offering
            clients personalized matching based on preferences and requirements.
            Working with an agency provides an added layer of security and
            professionalism compared to independent arrangements.
          </p>
        </div>
        {/* Spa Section */}
        <div className="font-semibold space-y-5 mt-8">
          <h2 className="text-xl">Spas</h2>
          <p>
            Spas offer a comprehensive wellness experience that combines
            relaxation with therapeutic services. These establishments typically
            feature facilities such as saunas, steam rooms, hot tubs, and
            relaxation lounges alongside their service offerings. Spa services
            often include various body treatments, skincare rituals,
            hydrotherapy, and sensual massage therapies performed by trained
            professionals in a serene, hygienic environment. Many spas
            incorporate elements of{" "}
            <span className="text-primary">tantric</span> practices or{" "}
            <span className="text-primary">sensual</span> therapies that focus
            on energy flow, intimacy, and holistic well-being. The spa setting
            provides a discreet, upscale atmosphere for clients seeking both
            physical and emotional rejuvenation.
          </p>
        </div>
        {/* Massage Section */}
        <div className="font-semibold space-y-5 mt-8">
          <h2 className="text-xl">Massage Services</h2>
          <p>
            Professional massage services focus on therapeutic touch, stress
            relief, and physical relaxation through various techniques. These
            services range from traditional therapeutic massages like Swedish
            and deep tissue to more specialized{" "}
            <span className="text-primary">erotic</span> or{" "}
            <span className="text-primary">sensual</span> massage modalities.
            Qualified practitioners use oils, lotions, and specialized equipment
            to address muscle tension, improve circulation, and promote overall
            relaxation. Many massage providers offer private, discreet settings
            with attention to ambiance including mood lighting, soothing music,
            and comfortable facilities. Whether for purely therapeutic purposes
            or incorporating sensual elements, massage services prioritize
            client comfort, professional boundaries, and quality care.
          </p>
        </div>
        {/* Brothel Section */}
        <div className="font-semibold space-y-5 mt-8">
          <h2 className="text-xl">Brothels</h2>
          <p>
            <span className="text-primary">Brothels</span> are licensed
            establishments where sexual services are offered in a regulated,
            controlled environment. These venues operate with strict health and
            safety protocols, including regular medical checkups for providers
            and adherence to local regulations. Brothels typically feature
            private rooms, communal areas, and professional management that
            oversees operations and ensures compliance with legal requirements.
            Clients can choose from available providers in a{" "}
            <span className="text-primary">discreet</span> , secure setting
            designed for privacy and comfort. The structured nature of brothels
            provides clear expectations, standardized services, and protection
            for both clients and workers through established guidelines and
            professional management.
          </p>
        </div>
        {/* BDSM section */}
        <div className="font-semibold space-y-5 mt-8">
          <h2 className="text-xl   ">BDSM studios</h2>{" "}
          <p>
            BDSM studios offer equipment for practicing BDSM activities. These
            studios usually have specially designed rooms that are equipped with
            various <span className="text-primary">BDSM </span> accessories. For
            example, you can find handcuffs, whips, muzzles, nipple clamps,
            ropes, leather and latex clothing,{" "}
            <span className="text-primary">bondage </span> crosses, or other
            accessories for fulfilling various fetishes. Studios often offer the
            opportunity to pay for the services of professional
            dominatrixes.{" "}
          </p>{" "}
        </div>

        {/* Nightclub section */}
        <div className="font-semibold space-y-5 mt-8">
          <h2 className="text-xl   ">Night clubs</h2>

          <p>
            <span className="text-primary">Night clubs</span> are establishments
            that are aimed at an adult audience and offer music, a dance floor,
            and often young and beautiful women. Therefore, these clubs are
            often also called strip clubs, erotic clubs, or gentleman's clubs.
            In nightclubs, dancers perform erotic dances,{" "}
            <span className="text-primary">striptease</span>, or other
            attractive performances. Some clubs also offer private or VIP rooms
            where you can get even more intimate interaction with the dancers or
            strippers.
          </p>
        </div>
      </SectionCard>
    </article>
  );
};

export default SectionArticle;
