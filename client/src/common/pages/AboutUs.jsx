import DynamicPageTitle from "../utils/pageTitle/DynamicPageTitle";
import PageMeta from "../components/ui/PageMeta.jsx";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

const AboutUs = () => {
  const pageTitle = usePageTitle();
  return (
    <div>
      <PageMeta
        title="About Us || Nova-Cart"
        description="You can know about us from here in details."
      />
      <DynamicPageTitle pageTitle={pageTitle} />
      <div className="">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda,
          laudantium ut quas minus vero laborum corrupti eos porro quos. Placeat
          earum delectus iste eveniet quod reprehenderit, esse numquam dolorem
          doloribus?
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
