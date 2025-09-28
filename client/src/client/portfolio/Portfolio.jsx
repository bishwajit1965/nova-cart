import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

const Portfolio = () => {
  const pageTitle = usePageTitle();
  return (
    <div>
      <DynamicPageTitle pageTitle={pageTitle} />
      <div className="">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
          aspernatur suscipit autem quidem praesentium atque! Eaque architecto
          eum necessitatibus blanditiis doloribus dolore sint quia suscipit,
          enim harum velit placeat atque!
        </p>
      </div>
    </div>
  );
};

export default Portfolio;
