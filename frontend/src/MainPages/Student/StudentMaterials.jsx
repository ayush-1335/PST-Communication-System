import { useStudent } from "../../context/StudentContext";

const StudentMaterials = () => {

  const { materials, loading } = useStudent();

  const handleDownload = async (url, title) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = title || "material";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading materials...</p>;
  }

  if (!materials || materials.length === 0) {
    return <p className="text-gray-500">No materials available</p>;
  }

  return (

    <div className="space-y-4">

      <h2 className="text-xl font-semibold mb-4">
        Study Materials
      </h2>

      {materials.map((material) => (

        <div
          key={material._id}
          className="border p-4 rounded-lg shadow-sm bg-gray-50"
        >

          <h3 className="font-semibold text-lg">
            {material.title}
          </h3>

          <p className="text-gray-600">
            Subject: {material.subject}
          </p>

          {material.description && (
            <p className="text-gray-500 text-sm mt-1">
              {material.description}
            </p>
          )}

          <div className="flex gap-4 mt-3">

            {/* View */}
            <a
              href={material.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              👁 View
            </a>

            {/* Download */}
            <button
              onClick={() => handleDownload(material.fileUrl, material.title)}
              className="text-green-600 hover:underline"
            >
              ⬇ Download
            </button>

          </div>

        </div>

      ))}

    </div>

  );
};

export default StudentMaterials;