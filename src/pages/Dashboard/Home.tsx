import EcommerceMetrics from "./EcommerceMetrics";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import RecentOrders from "./RecentOrders";
import PageMeta from "../../components/common/PageMeta";
import BarChartOne from "../../components/charts/bar/BarChartOne";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PieChart from "../../components/charts/pie/pieChart";
// import BarChart from "./pages/Charts/BarChart";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <EcommerceMetrics />
        </div>

        <div className="col-span-6 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
          <BarChartOne />
        </div>
        <div className="col-span-6 row-span-2 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
          <PieChart />
        </div>
        <div className="col-span-6 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
          <LineChartOne />
        </div>
        <div className="col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
