import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const qActivity = query.get("activity");
  const qStateCode = query.get("stateCode");
  const qSearchTerm = query.get("q");

  return { qActivity, qStateCode, qSearchTerm };
};

export default useQueryParams;
