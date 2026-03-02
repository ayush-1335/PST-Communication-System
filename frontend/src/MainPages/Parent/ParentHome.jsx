import ParentChildrenList from "./ParentChildrenList";

const ParentHome = () => {
  return (
    <div>

      <h2 className="text-2xl font-semibold mb-6">
        My Children
      </h2>

      <ParentChildrenList />

    </div>
  );
};

export default ParentHome;