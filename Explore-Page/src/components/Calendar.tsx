import { getCalApi } from "@calcom/embed-react";
  import { useEffect } from "react";
  export default function MyApp() {
	useEffect(()=>{
	  (async function () {
		const cal = await getCalApi({"namespace":"15min"});
		cal("ui", {"hideEventTypeDetails":false,"layout":"week_view"});
	  })();
	}, [])
	return <button data-cal-namespace="15min"
	  data-cal-link="kevin-d-rymop2/15min"
    
	  data-cal-config='{"layout":"week_view"}'
	  >Click me</button>;
  };