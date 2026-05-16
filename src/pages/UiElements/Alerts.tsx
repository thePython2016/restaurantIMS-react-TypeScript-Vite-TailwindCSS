import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Alert from "../../components/ui/alert/Alert";
import PageMeta from "../../components/common/PageMeta";
import { useState } from "react";

export default function Alerts() {
  const [showSuccessAlert, setShowSuccessAlert] = useState(true);
  const [showWarningAlert, setShowWarningAlert] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(true);
  const [showInfoAlert, setShowInfoAlert] = useState(true);
  return (
    <>
      <PageMeta
        title="React.js Alerts Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Alerts Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Alerts" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Success Alert">
          <Alert
            variant="success"
            title="Success Message"
            message="Be cautious when performing this action."
            showLink={true}
            linkHref="/"
            linkText="Learn more"
          />
          <Alert
            variant="success"
            title="Success Message"
            message="Be cautious when performing this action."
            showLink={false}
          />
          {showSuccessAlert && (
            <Alert
              variant="success"
              title="Closable Success Alert"
              message="This alert can be closed by clicking the X button."
              closable={true}
              onClose={() => setShowSuccessAlert(false)}
            />
          )}
        </ComponentCard>
        <ComponentCard title="Warning Alert">
          <Alert
            variant="warning"
            title="Warning Message"
            message="Be cautious when performing this action."
            showLink={true}
            linkHref="/"
            linkText="Learn more"
          />
          <Alert
            variant="warning"
            title="Warning Message"
            message="Be cautious when performing this action."
            showLink={false}
          />
          {showWarningAlert && (
            <Alert
              variant="warning"
              title="Closable Warning Alert"
              message="This alert can be closed by clicking the X button."
              closable={true}
              onClose={() => setShowWarningAlert(false)}
            />
          )}
        </ComponentCard>
        <ComponentCard title="Error Alert">
          <Alert
            variant="error"
            title="Error Message"
            message="Be cautious when performing this action."
            showLink={true}
            linkHref="/"
            linkText="Learn more"
          />
          <Alert
            variant="error"
            title="Error Message"
            message="Be cautious when performing this action."
            showLink={false}
          />
          {showErrorAlert && (
            <Alert
              variant="error"
              title="Closable Error Alert"
              message="This alert can be closed by clicking the X button."
              closable={true}
              onClose={() => setShowErrorAlert(false)}
            />
          )}
        </ComponentCard>
        <ComponentCard title="Info Alert">
          <Alert
            variant="info"
            title="Info Message"
            message="Be cautious when performing this action."
            showLink={true}
            linkHref="/"
            linkText="Learn more"
          />
          <Alert
            variant="info"
            title="Info Message"
            message="Be cautious when performing this action."
            showLink={false}
          />
          {showInfoAlert && (
            <Alert
              variant="info"
              title="Closable Info Alert"
              message="This alert can be closed by clicking the X button."
              closable={true}
              onClose={() => setShowInfoAlert(false)}
            />
          )}
        </ComponentCard>
      </div>
    </>
  );
}
