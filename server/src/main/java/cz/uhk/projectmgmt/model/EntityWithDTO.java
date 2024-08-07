package cz.uhk.projectmgmt.model;

public interface EntityWithDTO<DTO> {

    default DTO mapEntityToDTO() {
        return mapEntityToDTO(false);
    }

    DTO mapEntityToDTO(boolean fetchCollections);
}
