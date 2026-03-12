package mk.ukim.finki.library_app.service.domain.impl;

import mk.ukim.finki.library_app.model.domain.Country;
import mk.ukim.finki.library_app.repository.AuthorRepository;
import mk.ukim.finki.library_app.repository.CountryRepository;
import mk.ukim.finki.library_app.service.domain.CountryService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CountryServiceImpl implements CountryService {

    private final CountryRepository countryRepository;
    private final AuthorRepository authorRepository;

    public CountryServiceImpl(CountryRepository countryRepository, AuthorRepository authorRepository) {
        this.countryRepository = countryRepository;
        this.authorRepository = authorRepository;
    }

    @Override
    public Optional<Country> findById(Long id) {
        return countryRepository.findById(id);
    }

    @Override
    public List<Country> findAll() {
        return countryRepository.findAllByOrderByIdAsc();
    }

    @Override
    public Country create(Country country) {
        return countryRepository.save(country);
    }

    @Override
    public Optional<Country> update(Long id, Country country) {
        return countryRepository.findById(id).map(existingCountry -> {
            existingCountry.setName(country.getName());
            existingCountry.setContinent(country.getContinent());
            return countryRepository.save(existingCountry);
        });
    }

    @Override
    public Optional<Country> deleteById(Long id) {

        if (authorRepository.existsByCountryId(id)) {
            throw new RuntimeException("Cannot delete country because it has associated authors.");
        }

        Optional<Country> country = countryRepository.findById(id);
        country.ifPresent(countryRepository::delete);
        return country;
    }

}
